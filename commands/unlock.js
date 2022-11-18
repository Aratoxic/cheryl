const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Color = require("../config/color.json");
const LanguageFR = require("../languages/fr.json");
const LanguageEN = require("../languages/en.json");
const LanguageDE = require("../languages/de.json");
const LanguageSP = require("../languages/sp.json");
const LanguageNL = require("../languages/nl.json");

const fr = LanguageFR.unlock;
const en = LanguageEN.unlock;
const de = LanguageDE.unlock;
const sp = LanguageSP.unlock;
const nl = LanguageNL.unlock;

const dateTime = new Date();
console.log(dateTime.toLocaleString() + " -> The '" + en.Name + "' command is loaded.");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(en.Name)
        .setNameLocalizations({
            fr: fr.Name,
            de: de.Name,
            SpanishES: sp.Name,
            nl: nl.Name
        })
        .setDescription(en.Description)
        .setDescriptionLocalizations({
            fr: fr.Description,
            de: de.Description,
            SpanishES: sp.Description,
            nl: nl.Description
        }),
    execute: async (interaction) => {
        const CommandFunction = sequelize.define("CommandFunction", {
            name: {
                type: Sequelize.STRING,
            },
            value: {
                type: Sequelize.STRING,
            },
        });

        const FindCommand = await CommandFunction.findOne({ where: { name: en.Name } });

        const MessageReason = require("../config/message.json");

        if (FindCommand) {
            if (FindCommand.value === "Disable") {
                return interaction.reply({
                    content: MessageReason.CommandDisabled,
                    ephemeral: true,
                });
            };
        };

        if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
            if (interaction.guild.me.permissions.has("MANAGE_CHANNELS")) {
                await interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, { SEND_MESSAGES: true })

                const unLockdownSuccess = new MessageEmbed()
                    .setDescription("The channel has been successfully unlock.")
                    .setColor(Color.Green)

                return interaction.reply({
                    embeds: [unLockdownSuccess]
                });
            } else {
                return interaction.reply({
                    content: "I need the following permission ```MANAGE_CHANNELS``.",
                    ephemeral: true
                });
            };
        } else {
            return interaction.reply({
                content: "You cannot execute this command! You need the following permission ```MANAGE_MESSAGES``.",
                ephemeral: true
            });
        };
    }
};